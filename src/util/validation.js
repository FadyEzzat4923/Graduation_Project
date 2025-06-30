export function isEmail(email) {
  const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return gmailPattern.test(email);
}

export function isNotEmpty(text) {
  return (
    typeof text === "string" &&
    text.trim().length >= 3 &&
    text.trim().length <= 100
  );
}

export function isDetails(details) {
  return typeof details === "string" && details.trim().length >= 3;
}

export function isPhoneNumber(number) {
  const egyptPhonePattern = /^(01[0125])[0-9]{8}$/;
  return egyptPhonePattern.test(number);
}
