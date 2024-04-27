import moment from 'moment';

export const isLoggedIn = () => {
  const expiresAtStr = localStorage.getItem('ms_expires_at');

  const expires_at = expiresAtStr ? moment(expiresAtStr) : null;
  if (!expires_at) {
    return false;
  }
  if (expires_at && expires_at.isBefore(moment())) {
    resetLoggedInStoreData();
    return false;
  }
  return true;
};

export const resetLoggedInStoreData = () => {
  localStorage.removeItem('ms_expires_at');
  localStorage.removeItem('ms_user');
  localStorage.removeItem('ms_mail');
};
