const emailPrefix = 'iknowa.alias.';

function aliasEmail(email) {
  let value = email;
  const key = emailPrefix;

  if (!value.startsWith(key)) {
    value = key + email;
  }

  return value;
}

function removeEmailAlias(email) {
  return email.replace(emailPrefix, '');
}

export {
  aliasEmail,
  removeEmailAlias
};
