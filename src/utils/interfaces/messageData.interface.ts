export default interface IMessageData {
  content: string;
  sender: string;
  receiver: string;
  createdAt: Date;
  entity?: "client" | "trainer";
  readAt?: Date | undefined;
}
