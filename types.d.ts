type Outfit = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  tag: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
};

type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  password: string;
  address: string;
  role: string;
};

type Cart = {
  id: string;
  bust: string;
  waist: string;
  hips: string;
  height: string;
  additionalInfo: string;
  colour: string;
  size: string;
  deliveryType: string;
  quantity: number;
  client: Client;
  product: Outfit;
  createdAt: string;
  updatedAt: string;
};

type Order = {
  id: string;
  product: Cart[];
  client: Client;
  createdAt: string;
  deliveredAt: string;
  status: string;
};

type WishList = {
  id: string;
  product: Outfit;
  client: Client; 
  createdAt: string;
  updatedAt: string;
};

type Tag = {
  name: string;
  data: Outfit[]
}