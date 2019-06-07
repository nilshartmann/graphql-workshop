export default class Service {
  getUser(userId: string) {
    return {
      userId,
      name: userId.toUpperCase()
    };
  }
}
