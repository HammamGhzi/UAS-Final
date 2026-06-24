import { useState } from "react";
import { Card } from "../../components/UI/Card";
import { Button } from "../../components/UI/Button";
import { Palette } from "lucide-react";

const Motifs = () => {
  const [motifs] = useState([]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-brown-900">Motif</h1>
        <Button variant="primary"><Palette size={16} /> Tambah Motif</Button>
      </div>
      <Card className="p-6">
        <p className="text-brown-500">Data motif akan tampil di sini.</p>
      </Card>
    </div>
  );
};

export default Motifs;