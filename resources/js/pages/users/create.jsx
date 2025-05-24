const breadcrumbs = [{ title: 'Registrar usuarios', href: '/users/create' }];
import { useState, useEffect } from 'react';
import { Toast, Button, TextInput, Label, Checkbox } from 'flowbite-react';
import { HiCheck, HiX } from 'react-icons/hi';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import FromCreate from '@/components/formCreate';
import AppLayout from '@/layouts/app-layout';
import RegisterCard from '@/components/userRegisterCard';

export default function UsersCreate() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
    areas: [],
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');


  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'areas') {
      const updatedAreas = checked
        ? [...form.areas, value]
        : form.areas.filter((a) => a !== value);
      setForm((prev) => ({ ...prev, areas: updatedAreas }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const [toast, setToast] = useState({
    show: false,
    success: false,
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    axios.post('/users.store', form)
      .then((res) => {
        setToast({
          show: true,
          success: true,
          message: res.data?.message || 'Usuario registrado correctamente.',
        });
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
        setForm({
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
          role: '',
          areas: [],
        });
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          setErrors(err.response.data.errors);
          setToast({
            show: true,
            success: false,
            message: 'Ocurrió un error al registrar el usuario.',
          });
          setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
        }
      });
  };
  

  const isSupervisor = form.role === 'Supervisor';

  return  (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Registrar usuario" />

      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast>
            <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              toast.success ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
            }`}>
              {toast.success ? <HiCheck className="h-5 w-5" /> : <HiX className="h-5 w-5" />}
            </div>
            <div className="ml-3 text-sm font-normal">{toast.message}</div>
          </Toast>
        </div>
      )}

      <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <FromCreate submit={handleSubmit} form={form} change={handleChange} errors={errors} isSupervisor={isSupervisor}/>
        <div className='className="min-h-screen   flex items-center justify-center py-12 px-4"'>
          <RegisterCard form={form} supervisor={isSupervisor}/>
        </div>
      </div>
    </AppLayout>
  );
}
