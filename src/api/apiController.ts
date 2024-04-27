import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API } from './API';
import moment, { Moment } from 'moment';
import { AppControllerType, MessageType } from '../controller/appController';
import { CONVERSATIONS } from '../content/conversation';
import { isLoggedIn } from './utils/isLoggedIn';
import { useLocalStorage } from '../controller/useLocalStorage';

export type ApiStateType = {
  conversation: {
    conversation_id: string | null;
  };
  myAppointments: any[];
  user: {
    id: string;
    surname: string;
    displayName: string;
    givenName: string;
    mail: string;
    preferredLanguage: string;
    userPrincipalName: string;
    imageObjectUrl: string | null;
  } | null;
  useOwnCalendar: boolean;
  loading: boolean;
};

export type ApiControllerParams = {
  appController: AppControllerType;
};

export const useApiController = (params: ApiControllerParams) => {
  const { actions: appActions, appState } = params?.appController ?? {};

  const [apiState, setApiState] = useState<ApiStateType>(() => ({
    conversation: {
      conversation_id: null,
    },
    myAppointments: [],
    user: null,
    useOwnCalendar: false,
    loading: false,
  }));
  const [searchParams, setSearchParams] = useSearchParams();
  const codeSearchParams = searchParams.get('code');
  const conversation_id = searchParams.get('conversation_id');

  const actions = useMemo(() => {
    return {
      toggleUseOwnCalendar: () => {
        setApiState((current) => ({
          ...current,
          useOwnCalendar: !current.useOwnCalendar,
        }));
      },
      queryMyAppointments: async () => {
        try {
          const res = await API.getMyAppointments().query();
          const myAppointments = res?.data?.appointments;
          setApiState((current) => ({ ...current, myAppointments }));
        } catch (e) {
          console.error('error', e);
        }
      },
      resetMyAppointments: () => {
        setApiState((current) => ({ ...current, appointments: [] }));
      },
      queryUserImage: async () => {
        const resImgBlob = await API.getUserPicture().query();
        const srcData = resImgBlob.data;
        setApiState((current) => ({
          ...current,
          user: { ...((current?.user ?? {}) as any), imageObjectUrl: srcData },
        }));
      },
      authUserCodeForToken: async (code: string) => {
        const payload = {
          code,
        };
        const res = await API.authWithMsCode.query(payload);
        if (res.status !== 200) {
          console.error('error', res.error);
          return res;
        }
        const data = res.data;
        const expires_at = moment(data?.expires_at).format(
          'YYYY-MM-DD HH:mm:ss'
        );
        localStorage.setItem(
          'ms_expires_at',
          moment.utc(expires_at).local().format('YYYY-MM-DD HH:mm:ss')
        );
        localStorage.setItem('ms_user', data.user.displayName);
        localStorage.setItem('ms_mail', data.user.mail);
        console.log('EXECUTE ApiController.actions.authUserCodeForToken()');
        setSearchParams('');
        setApiState((current) => ({
          ...current,
          user: data?.user ?? current.user,
        }));
        appActions.setChatStatus('confirm_contact');
      },
      logoutUser: async () => {
        console.log('EXECUTE ApiController.actions.logoutUser()');
        setApiState((current) => ({
          ...current,
          user: null,
          conversation: { conversation_id: null },
        }));
        appActions.replaceMessages([]);
        appActions.setChatStatus('login');
        localStorage.removeItem('ms_user');
        localStorage.removeItem('ms_mail');
        localStorage.removeItem('ms_expires_at');
        setSearchParams('');
      },
      getAudiConversation: async (
        conversation_id: string,
        audioKeys?: string[]
      ) => {
        const payload = { audioKeys };
        const resAudio1All = await API.getAudioConversation(
          conversation_id
        ).query(payload as any);
        const resAudio1 = resAudio1All.data;
        const headers = resAudio1All.headers;
        const audioFilesCount = headers?.['content-count']
          ? parseInt(headers?.['content-count']) || 0
          : 0;

        const audioMessages: any[] = [];

        const readSync = (audioFileRes: Blob) =>
          new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onload = function (e: any) {
              const srcUrl = e.target.result;
              audioMessages.push(srcUrl);
              res(true);
            };
            reader.onerror = (e) => {
              console.error('ERROR', e);
              rej(e);
            };
            reader.onabort = (e) => {
              console.error('ERROR', e);
              rej(e);
            };
            reader.readAsDataURL(audioFileRes);
          });

        for (let a = 0; a < audioFilesCount; a++) {
          const audioFileRes =
            a === 0
              ? resAudio1
              : (
                  await API.getAudioConversation(conversation_id, a).query(
                    payload as any
                  )
                )?.data;
          // reader.readAsDataURL(audioFileRes);
          await readSync(audioFileRes);
        }
        appActions.setAudioFiles(audioMessages);
      },
      sendChatMessage: async (message: string, directActionKey?: string) => {
        setApiState((current) => ({
          ...current,
          loading: true,
        }));
        try {
          const userMessage: MessageType[] = [
            { contents: [{ message }], sender: 'user' },
          ];

          const lastMessage =
            appState.data.messages[appState.data.messages.length - 1];
          let payload =
            lastMessage?.sender === 'assistant'
              ? lastMessage?.contents?.find((c) => c.type === 'form')
                ? appState.ui.formData
                : undefined
              : undefined;

          if (directActionKey) {
            if (!payload) payload = {};
            const valueAdj = (directActionKey as unknown as Moment)?.isValid?.()
              ? moment(directActionKey).format('YYYY-MM-DD HH:mm')
              : directActionKey;
            payload._action = valueAdj;
          } else {
            if (!payload) payload = {};
            payload._message = message;
          }

          const response = await API.sendMessage(
            conversation_id ?? 'new'
          ).query(payload as any);
          const conversationIdReceived =
            response?.data?._conversation?.conversation_id;

          const assistantMessages = response?.data?._messages ?? [];
          const newMessages: MessageType[] = [
            ...userMessage,
            ...assistantMessages,
          ];

          if (appState.ui.requestAudio) {
            const audioKeys = assistantMessages
              .map((m: any) => m.audio)
              .flat()
              .filter((val: any) => val);
            actions.getAudiConversation(conversationIdReceived, audioKeys);
          }

          appActions.addMessages(newMessages);
          appActions.setChatStatus('appointment_prefs');
          setApiState((current) => ({
            ...current,
            conversation: response?.data?._conversation ?? current.conversation,
          }));

          if (conversationIdReceived) {
            setSearchParams((params) => {
              params.set('conversation_id', conversationIdReceived ?? '');
              return params;
            });
          }

          return { success: true };
        } catch (e) {
          console.error('error', e);
          return { success: false };
        } finally {
          setApiState((current) => ({
            ...current,
            loading: false,
          }));
        }
      },
      reloadConversation: async () => {
        if (!conversation_id) return;
        try {
          if (appState.ui.requestAudio) {
            actions.getAudiConversation(conversation_id);
          }
          const response = await API.getConversation(conversation_id).query();
          const assistantMessages = response?.data?._messages ?? [];
          const newMessages: MessageType[] = assistantMessages;
          appActions.replaceMessages(newMessages);
          appActions.setChatStatus(
            response?.data?._conversation?.step ?? 'appointment_prefs'
          );
          setApiState((current) => ({
            ...current,
            conversation: response?.data?._conversation ?? current.conversation,
          }));
          return { success: true };
        } catch (e) {
          console.error('error', e);
          return { success: false };
        }
      },
    };
  }, [appActions, setSearchParams, appState, conversation_id]);

  // after github login -> auth with code (always imparative impl.)
  useEffect(() => {
    if (!codeSearchParams) return;
    const authQuery = async () => {
      await actions.authUserCodeForToken(codeSearchParams);
      await actions.queryUserImage();
    };
    authQuery();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeSearchParams]);

  // not sure yet if all messages should be controlled imparetively here or not
  useEffect(() => {
    if (codeSearchParams) return; // if code is present code verification is still ongoing -> not yet ready
    const chatStatus = appState.chatStatus;
    if (!chatStatus) return;
    if (chatStatus === 'login') {
      const newMessages: MessageType[] = CONVERSATIONS._01_askForLogin() as any;
      appActions.replaceMessages(newMessages);
      return;
    }
    if (chatStatus === 'confirm_contact') {
      const newMessages: MessageType[] = CONVERSATIONS._02_askToConfirmLogin({
        name: apiState.user?.displayName ?? localStorage.getItem('ms_user'),
        email: apiState.user?.mail ?? localStorage.getItem('ms_mail'),
      }) as any;
      appActions.replaceMessages(newMessages);
      return;
    }
  }, [appState.chatStatus, codeSearchParams]);

  const loggedIn = isLoggedIn();
  useEffect(() => {
    if (loggedIn && !codeSearchParams) {
      actions.reloadConversation();
    }
    if (loggedIn) {
      actions.queryUserImage();
    }
  }, []);

  useEffect(() => {
    if (appState.data?.audio?.length || !apiState.conversation.conversation_id)
      return;
    actions.getAudiConversation(apiState.conversation.conversation_id);
  }, [appState.ui.requestAudio]);

  const [ls] = useLocalStorage();
  useEffect(() => {
    if (ls && !ls?.ms_expires_at) {
      console.log('localStorage changed, about to logout', ls);
      actions.logoutUser();
    }
  }, [ls]);

  return {
    apiState,
    actions,
  };
};

export type ApiControllerType = ReturnType<typeof useApiController>;
