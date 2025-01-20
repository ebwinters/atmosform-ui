import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Form {
  id: string;
  title: string;
}

const FormList: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);

  const fetchForms = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3333/api/v1/forms`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setForms(data);
      }
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  return (
    <div>
      <h1>Your Forms</h1>
      <div>
        {forms.map((form) => (
          <div key={form.id}>
            <Link to={`/forms/${form.id}`}>{form.title}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormList;
