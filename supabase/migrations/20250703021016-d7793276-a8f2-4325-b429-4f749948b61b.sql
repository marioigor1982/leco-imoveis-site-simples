-- Criar tabela users_metadata para controle de aprovação
CREATE TABLE public.users_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Criar tabela imoveis
CREATE TABLE public.imoveis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  endereco TEXT NOT NULL,
  preco TEXT NOT NULL,
  tipo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  imagens TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.users_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imoveis ENABLE ROW LEVEL SECURITY;

-- Políticas para users_metadata
CREATE POLICY "Admin can manage users_metadata"
  ON public.users_metadata
  FOR ALL
  USING (auth.jwt() ->> 'email' = 'mario.igor1982@gmail.com');

CREATE POLICY "Users can read own metadata"
  ON public.users_metadata
  FOR SELECT
  USING (auth.uid() = user_id);

-- Políticas para imoveis
CREATE POLICY "User can insert own imoveis"
  ON public.imoveis
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can read own imoveis"
  ON public.imoveis
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "User can update own imoveis"
  ON public.imoveis
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "User can delete own imoveis"
  ON public.imoveis
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can see all imoveis"
  ON public.imoveis
  FOR SELECT
  USING (auth.jwt() ->> 'email' = 'mario.igor1982@gmail.com');

-- Função para criar entrada na users_metadata quando usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_metadata (user_id, email, is_approved)
  VALUES (NEW.id, NEW.email, false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função quando usuário se cadastra
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_metadata_updated_at
  BEFORE UPDATE ON public.users_metadata
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_imoveis_updated_at
  BEFORE UPDATE ON public.imoveis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Criar bucket para imagens dos imóveis
INSERT INTO storage.buckets (id, name, public) VALUES ('imoveis', 'imoveis', true);

-- Políticas para storage dos imóveis
CREATE POLICY "Users can upload their own property images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'imoveis' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view property images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'imoveis');

CREATE POLICY "Users can update their own property images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'imoveis' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own property images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'imoveis' AND auth.uid()::text = (storage.foldername(name))[1]);