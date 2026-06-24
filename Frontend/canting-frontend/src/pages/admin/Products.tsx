import { useState } from "react";
import { Card } from "../../components/UI/Card";
import { Button } from "../../components/UI/Button";
import { Plus, Edit2, Trash2 } from "lucide-react";

const Products = () => {
  const [products] = useState([]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-brown-900">Produk</h1>
        <Button variant="primary"><Plus size={16} /> Tambah Produk</Button>
      </div>
      <Card className="p-6">
        <p className="text-brown-500">Data produk akan tampil di sini.</p>
      </Card>
    </div>
  );
};

export default Products;