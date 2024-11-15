const verifyEmail = async (email) => {
  const response = await fetch(
    `https://api.neverbounce.com/v4/single/check?key=YOUR_API_KEY&email=${email}`
  );
  const data = await response.json();
  return data.result === "valid"; // trả về true nếu email tồn tại
};
