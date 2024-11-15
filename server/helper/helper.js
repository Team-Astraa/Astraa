export const generateCredentials = () => {
  const randomString = () => Math.random().toString(36).slice(-8);
  return {
    username: `user_${randomString()}`,
    password: randomString(),
  };
};
