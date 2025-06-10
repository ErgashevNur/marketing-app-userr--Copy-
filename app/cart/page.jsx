"use client";

import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";

const initialCart = [
  {
    id: 1,
    name: "NIVEA ayollar uchun dush geli, baliya gulining sarchilligi, 250 ml",
    seller: "Gucci",
    price: 25990,
    oldPrice: 29650,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxXnC3fwMwkbIt3ejGRIw3NmbDyUtgS5g2jA&s",
    qty: 1,
    delivery: "6-iyundan boshlab yetkazamiz",
  },
  {
    id: 2,
    name: "Idish yuvish vositasi Fairy Olma, 450 ml",
    seller: "Nice",
    price: 13990,
    oldPrice: 17500,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUHLJHha3cBRmQre-D2v5PdHc0wMs4tIB45NeTSbFalFmJXG_O5_a951FaTeK7zp8_s_w&usqp=CAU",
    qty: 1,
    delivery: "6-iyundan boshlab yetkazamiz",
  },
  {
    id: 3,
    name: "NIVEA MEN erkaklar uchun dezodorant sprey, qora va oq uchun ko'rinmas himoya, 150 ml",
    seller: "NVIDIA",
    price: 34990,
    oldPrice: 48000,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUHLJHha3cBRmQre-D2v5PdHc0wMs4tIB45NeTSbFalFmJXG_O5_a951FaTeK7zp8_s_w&usqp=CAU",
    qty: 1,
    delivery: "6-iyundan boshlab yetkazamiz",
  },
  {
    id: 4,
    name: "NIVEA ayollar uchun dush geli, baliya gulining sarchilligi, 250 ml",
    seller: "Gucci",
    price: 25990,
    oldPrice: 29650,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxXnC3fwMwkbIt3ejGRIw3NmbDyUtgS5g2jA&s",
    qty: 1,
    delivery: "6-iyundan boshlab yetkazamiz",
  },
  {
    id: 5,
    name: "Idish yuvish vositasi Fairy Olma, 450 ml",
    seller: "Nice",
    price: 13990,
    oldPrice: 17500,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUHLJHha3cBRmQre-D2v5PdHc0wMs4tIB45NeTSbFalFmJXG_O5_a951FaTeK7zp8_s_w&usqp=CAU",
    qty: 1,
    delivery: "6-iyundan boshlab yetkazamiz",
  },
  {
    id: 6,
    name: "NIVEA MEN erkaklar uchun dezodorant sprey, qora va oq uchun ko'rinmas himoya, 150 ml",
    seller: "NVIDIA",
    price: 34990,
    oldPrice: 48000,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUHLJHha3cBRmQre-D2v5PdHc0wMs4tIB45NeTSbFalFmJXG_O5_a951FaTeK7zp8_s_w&usqp=CAU",
    qty: 1,
    delivery: "6-iyundan boshlab yetkazamiz",
  },
  {
    id: 7,
    name: "NIVEA ayollar uchun dush geli, baliya gulining sarchilligi, 250 ml",
    seller: "Gucci",
    price: 25990,
    oldPrice: 29650,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxXnC3fwMwkbIt3ejGRIw3NmbDyUtgS5g2jA&s",
    qty: 1,
    delivery: "6-iyundan boshlab yetkazamiz",
  },
  {
    id: 8,
    name: "Idish yuvish vositasi Fairy Olma, 450 ml",
    seller: "Nice",
    price: 13990,
    oldPrice: 17500,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUHLJHha3cBRmQre-D2v5PdHc0wMs4tIB45NeTSbFalFmJXG_O5_a951FaTeK7zp8_s_w&usqp=CAU",
    qty: 1,
    delivery: "6-iyundan boshlab yetkazamiz",
  },
  {
    id: 9,
    name: "NIVEA MEN erkaklar uchun dezodorant sprey, qora va oq uchun ko'rinmas himoya, 150 ml",
    seller: "NVIDIA",
    price: 34990,
    oldPrice: 48000,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUHLJHha3cBRmQre-D2v5PdHc0wMs4tIB45NeTSbFalFmJXG_O5_a951FaTeK7zp8_s_w&usqp=CAU",
    qty: 1,
    delivery: "6-iyundan boshlab yetkazamiz",
  },
  {
    id: 10,
    name: "NIVEA ayollar uchun dush geli, baliya gulining sarchilligi, 250 ml",
    seller: "Gucci",
    price: 25990,
    oldPrice: 29650,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxXnC3fwMwkbIt3ejGRIw3NmbDyUtgS5g2jA&s",
    qty: 1,
    delivery: "6-iyundan boshlab yetkazamiz",
  },
  {
    id: 11,
    name: "Idish yuvish vositasi Fairy Olma, 450 ml",
    seller: "Nice",
    price: 13990,
    oldPrice: 17500,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUHLJHha3cBRmQre-D2v5PdHc0wMs4tIB45NeTSbFalFmJXG_O5_a951FaTeK7zp8_s_w&usqp=CAU",
    qty: 1,
    delivery: "6-iyundan boshlab yetkazamiz",
  },
  {
    id: 12,
    name: "NIVEA MEN erkaklar uchun dezodorant sprey, qora va oq uchun ko'rinmas himoya, 150 ml",
    seller: "NVIDIA",
    price: 34990,
    oldPrice: 48000,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUHLJHha3cBRmQre-D2v5PdHc0wMs4tIB45NeTSbFalFmJXG_O5_a951FaTeK7zp8_s_w&usqp=CAU",
    qty: 1,
    delivery: "6-iyundan boshlab yetkazamiz",
  },
];

export default function CartPage() {
  const [cart, setCart] = useState(initialCart);
  const [checked, setChecked] = useState(cart.map(() => false));
  const [checkAll, setCheckAll] = useState(false);

  // Update checked state if cart changes (e.g. remove)
  useEffect(() => {
    setChecked((prev) => {
      if (cart.length === prev.length) return prev;
      // If cart shrinks, remove extra checked
      return cart.map((_, i) => prev[i] || false);
    });
  }, [cart]);

  const handleCheckAll = (e) => {
    const checkedValue = e.target.checked;
    setCheckAll(checkedValue);
    setChecked(cart.map(() => checkedValue));
  };

  const handleCheck = (idx) => {
    setChecked((prev) => {
      const arr = [...prev];
      arr[idx] = !arr[idx];
      return arr;
    });
  };

  // Update checkAll if all checked
  useEffect(() => {
    setCheckAll(checked.every(Boolean) && checked.length > 0);
  }, [checked]);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const oldTotal = cart.reduce(
    (sum, item) => sum + (item.oldPrice || item.price) * item.qty,
    0
  );
  const savings = oldTotal - total;

  // Checked mahsulotlar bo'yicha hisoblash
  const checkedTotal = cart.reduce(
    (sum, item, idx) => (checked[idx] ? sum + item.price * item.qty : sum),
    0
  );
  const checkedOldTotal = cart.reduce(
    (sum, item, idx) =>
      checked[idx] ? sum + (item.oldPrice || item.price) * item.qty : sum,
    0
  );
  const checkedSavings = checkedOldTotal - checkedTotal;

  const handleQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Yetkazib berish sanasini hisoblash funksiyasi
  const getDeliveryDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    // Format: 9-iyun
    const months = [
      "yanvar",
      "fevral",
      "mart",
      "aprel",
      "may",
      "iyun",
      "iyul",
      "avgust",
      "sentabr",
      "oktabr",
      "noyabr",
      "dekabr",
    ];
    const day = today.getDate();
    const month = months[today.getMonth()];
    return `${day}-${month}`;
  };

  return (
    <section className="container">
      <h2 className="text-2xl font-bold mb-4">
        Savatingiz,{" "}
        <span className="text-[#8b5cf6]">{cart.length} mahsulot</span>
      </h2>

      <div className="flex flex-col md:flex-row gap-8 p-8 bg-[#f3f3f3] min-h-screen items-start ">
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="dark:bg-gray-900 border rounded-xl shadow p-4">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                className="mr-2"
                checked={checkAll}
                onChange={handleCheckAll}
                style={{ width: 22, height: 22 }}
              />
              <span className="font-medium">Hammasini tanlash</span>
            </div>
            {/* Scrollable cart items */}
            <div className="h-[400px] w-full overflow-y-auto rounded-lg p-4 pr-2">
              {cart.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 border-b py-4 text-black dark:text-gray-200 last:border-b-0 max-w-[500px] w-full"
                >
                  <input
                    type="checkbox"
                    className="mt-2"
                    checked={checked[idx] || false}
                    onChange={() => handleCheck(idx)}
                    style={{ width: 22, height: 22 }}
                  />
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">
                      Uzum Market omborida
                    </div>
                    <div className="text-sm text-[#4f46e5] font-semibold mb-1">
                      {item.delivery}
                    </div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Sotuvchi:{" "}
                      <span className="font-semibold">"{item.seller}"</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        className="border rounded w-8 h-8 flex items-center justify-center"
                        onClick={() => handleQty(item.id, -1)}
                      >
                        −
                      </button>
                      <span className="mx-2">{item.qty}</span>
                      <button
                        className="border rounded w-8 h-8 flex items-center justify-center"
                        onClick={() => handleQty(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-[120px]">
                    <button
                      className="text-gray-400 hover:text-red-500 text-xs"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Trash2Icon />
                    </button>
                    <div className="text-right">
                      {item.oldPrice && (
                        <div className="text-xs text-gray-400 line-through">
                          {item.oldPrice.toLocaleString()} so'm
                        </div>
                      )}
                      <div className="text-pink-600 font-bold text-lg">
                        {item.price.toLocaleString()} so'm
                      </div>
                      <div className="text-xs text-pink-600 font-semibold">
                        Arzon narx kafolati
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Order summary */}
        <div className="w-[550px] fixed right-10">
          <div className="dark:bg-gray-900 w-[500px] rounded-lg shadow p-6 sticky top-8">
            <div className="flex flex-col gap-2 mb-4">
              <span className="font-semibold text-lg">Savatcha hisoboti</span>
              <span className="text-sm text-gray-500">
                Tanlangan mahsulotlar soni:{" "}
                <span className="font-bold">
                  {checked.filter(Boolean).length}
                </span>
              </span>
              <span className="text-sm text-gray-500">
                Umumiy narx:{" "}
                <span className="font-bold">
                  {checkedOldTotal.toLocaleString()} so'm
                </span>
              </span>
              <span className="text-sm text-gray-500">
                Chegirmadan so'ng:{" "}
                <span className="font-bold">
                  {checkedTotal.toLocaleString()} so'm
                </span>
              </span>
              <span className="text-sm text-green-600">
                Tejovingiz:{" "}
                <span className="font-bold">
                  {checkedSavings.toLocaleString()} so'm
                </span>
              </span>
            </div>
            <div className="mb-2">
              <input
                type="text"
                value={`Yetkazib berish ${getDeliveryDate()}`}
                readOnly
                className="w-full border rounded px-2 py-1 text-center text-sm mb-2"
              />
            </div>
            <button className="px-5 py-3 bg-violett">Rasmiylashtirish</button>
          </div>
        </div>
      </div>
    </section>
  );
}
