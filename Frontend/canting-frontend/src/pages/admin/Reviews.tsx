import { useState } from "react";
import { Card } from "../../components/UI/Card";
import { Star, Trash2 } from "lucide-react";

const Reviews = () => {
  const [reviews] = useState([]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-brown-900">Review</h1>
      </div>
      <Card className="p-6">
        <p className="text-brown-500">Data review akan tampil di sini.</p>
      </Card>
    </div>
  );
};

export default Reviews;