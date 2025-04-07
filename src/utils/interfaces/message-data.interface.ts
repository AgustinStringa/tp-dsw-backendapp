export default interface IMessageData {
  content: string;
  sender: string;
  receiver: string;
  createdAt: Date;
  readAt?: Date | undefined;
}
