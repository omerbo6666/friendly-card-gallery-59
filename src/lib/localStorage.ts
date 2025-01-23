import { Client } from '@/types/investment';

const CLIENTS_STORAGE_KEY = 'investment-clients';

export const saveClients = (clients: Client[]) => {
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
};

export const getClients = (): Client[] => {
  const storedClients = localStorage.getItem(CLIENTS_STORAGE_KEY);
  return storedClients ? JSON.parse(storedClients) : [];
};

export const addClient = (client: Client) => {
  const clients = getClients();
  clients.push(client);
  saveClients(clients);
  return clients;
};

export const searchClients = (searchTerm: string): Client[] => {
  const clients = getClients();
  return clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.profession.toLowerCase().includes(searchTerm.toLowerCase())
  );
};