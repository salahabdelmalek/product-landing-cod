import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface Offer {
  name: string;
  description?: string;
  price: number;
}

interface ProductFormData {
  name: string;
  image: string;
  descriptionImage: string;
  originalPrice: number;
  discountedPrice: number;
  offers: Offer[];
}

interface Props {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
}

const ProductForm: React.FC<Props> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      name: '',
      image: '',
      descriptionImage: '',
      originalPrice: 0,
      discountedPrice: 0,
      offers: [{ name: 'عرض أساسي', price: 0 }],
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ المنتج');
    }
  };

  const addOffer = () => {
    setFormData({
      ...formData,
      offers: [...formData.offers, { name: '', price: 0 }],
    });
  };

  const removeOffer = (index: number) => {
    const newOffers = formData.offers.filter((_, i) => i !== index);
    setFormData({ ...formData, offers: newOffers });
  };

  const updateOffer = (index: number, field: keyof Offer, value: string | number) => {
    const newOffers = [...formData.offers];
    newOffers[index] = { ...newOffers[index], [field]: value };
    setFormData({ ...formData, offers: newOffers });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          اسم المنتج
        </label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          رابط صورة المنتج
        </label>
        <input
          type="url"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          رابط صورة الوصف
        </label>
        <input
          type="url"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={formData.descriptionImage}
          onChange={(e) =>
            setFormData({ ...formData, descriptionImage: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            السعر الأصلي
          </label>
          <input
            type="number"
            required
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={formData.originalPrice}
            onChange={(e) =>
              setFormData({
                ...formData,
                originalPrice: parseFloat(e.target.value),
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            السعر بعد الخصم
          </label>
          <input
            type="number"
            required
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={formData.discountedPrice}
            onChange={(e) =>
              setFormData({
                ...formData,
                discountedPrice: parseFloat(e.target.value),
              })
            }
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          العروض
        </label>
        {formData.offers.map((offer, index) => (
          <div key={index} className="flex gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="اسم العرض"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={offer.name}
                onChange={(e) => updateOffer(index, 'name', e.target.value)}
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                placeholder="السعر"
                required
                min="0"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={offer.price}
                onChange={(e) =>
                  updateOffer(index, 'price', parseFloat(e.target.value))
                }
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeOffer(index)}
                className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
              >
                حذف
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addOffer}
          className="mt-2 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-md"
        >
          + إضافة عرض
        </button>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300"
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
        >
          حفظ المنتج
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
