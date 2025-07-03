export interface UserMetadata {
  id: string;
  user_id: string;
  email: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Imovel {
  id: string;
  titulo: string;
  descricao: string;
  endereco: string;
  preco: string;
  tipo: string;
  status: string;
  user_id: string;
  imagens: string[];
  created_at: string;
  updated_at: string;
}

export type ImovelInsert = Omit<Imovel, 'id' | 'created_at' | 'updated_at'>;
export type ImovelUpdate = Partial<ImovelInsert>;