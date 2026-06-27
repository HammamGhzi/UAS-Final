import { useState } from "react";
import { Card } from "../../components/UI/Card";
import { Button } from "../../components/UI/Button";
import { Tag, Trash2 } from "lucide-react";

const Categories = () => {
  const [categories] = useState([]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-brown-900">Kategori</h1>
        <Button variant="primary"><Tag size={16} /> Tambah Kategori</Button>
      </div>
      <Card className="p-6">
        <p className="text-brown-500">Data kategori akan tampil di sini.</p>
      </Card>
    </div>
  );
};

export default Categories;