import { useState } from "react";
import { Card } from "../../components/UI/Card";
import { Button } from "../../components/UI/Button";
import { MapPin, Trash2 } from "lucide-react";

const Regions = () => {
  const [regions] = useState([]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-brown-900">Wilayah</h1>
        <Button variant="primary"><MapPin size={16} /> Tambah Wilayah</Button>
      </div>
      <Card className="p-6">
        <p className="text-brown-500">Data wilayah akan tampil di sini.</p>
      </Card>
    </div>
  );
};

export default Regions;