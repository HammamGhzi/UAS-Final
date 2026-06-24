import { useState } from "react";
import { Card } from "../../components/UI/Card";
import { Button } from "../../components/UI/Button";
import { Input } from "../../components/UI/Input";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

const Sanggars = () => {
  const [sanggars] = useState([]);
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-brown-900">Sanggar</h1>
        <Button variant="primary"><Plus size={16} /> Tambah Sanggar</Button>
      </div>
      <Card className="p-6">
        <Input
          placeholder="Cari sanggar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <p className="text-brown-500 mt-4">Data sanggar akan tampil di sini.</p>
      </Card>
    </div>
  );
};

export default Sanggars;