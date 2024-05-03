/* eslint-disable */
import { useState, useEffect } from "react";

export const useForm = (initialObj = {}) => {
    
    const [form, setForm] = useState(initialObj);
   
    const changed = ({ target }) => {
        const { name, value } = target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        })); 
    };
    
    useEffect(() => { 
        
    }, [form]);
    return { form, changed };
};

