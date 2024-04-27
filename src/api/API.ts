import { makeApiQuery } from './utils/makeApiQuery';

export const API = {
  getMyAppointments: () => makeApiQuery('GET', '/_api/_user/appointments'),
  getUserPicture: () => makeApiQuery('GET', '/_api/_user/picture'),
  sendMessage: (conversation_id: string) =>
    makeApiQuery('POST', `/_api/_conversation/appointments/${conversation_id}`),
  getConversation: (conversation_id: string) =>
    makeApiQuery('GET', `/_api/_conversation/appointments/${conversation_id}`),
  getAudioConversation: (conversation_id: string, audioIndex?: number) =>
    makeApiQuery<{ audioKeys?: string[] } | undefined>(
      'POST_GET_FILE',
      `/_api/_conversation/appointments_audio/${conversation_id}` +
        (audioIndex ? `?index=${audioIndex}` : '')
    ),

  getAppointmentSlots: makeApiQuery('GET', '/_api/_appointment_slots'),
  authWithMsCode: makeApiQuery<{ code: string }>('POST', '/_api/_ms_auth'),
  requestConfirmContactData: makeApiQuery(
    'POST',
    '/_api/_conversation/appointments/start_conversation_confirm_login'
  ),
  requestAppointmentPres: makeApiQuery(
    'POST',
    '/_api/_conversation/appointments/appointment_prefs'
  ),
  test: makeApiQuery('GET', '/_api/test'),
};
