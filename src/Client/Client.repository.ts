import { Repository } from "../shared/repository.js";
import { Client } from "./Client.entity.js";

const clients = [
  new Client('charly2409', 'charly1234', 'carlosgutierrez@gmail.com', 'Carlos Salvador', 'Gutiérrez'),
  new Client('marcelo912', 'marce1234', 'marcelogallardo@gmail.com', 'Marcelo', 'Gallardo'),
  new Client('chento', '1234', 'chentopavia@gmail.com', 'Agustín', 'Pavía')
];

export class ClientRepository implements Repository<Client>
{  
  public async findAll(): Promise<Client[] | undefined> {
    return clients;
  }

  public async findOne(item: {id: string}): Promise<Client | undefined> {
    return clients.find((client) => client.id === item.id);
  }

  public async add(item: Client): Promise<Client | undefined> {
    clients.push(item);
    return item;
  }

  public async update(item: Client): Promise<Client | undefined> {
    const index = clients.findIndex((client) => client.id === item.id);
    if (index !== -1)
      clients[index] = {...clients[index], ...item};
    
    return clients[index]
  }

  public async remove(item: { id: string; }): Promise<Client | undefined> {
    let deletedClient;
    const index = clients.findIndex((client) => client.id === item.id);
    if (index !== -1){
      deletedClient = clients[index];
      clients.splice(index, 1);
    }

    return deletedClient;
  }
}