import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import BarChart from './Chart';


function Form() {


  const [data, setData] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState('')
  const defaultValues = {
    name: '',
    email: '',
  }

  const url = `https://api.exchangerate.host/latest`


  useEffect(() => {

    axios.get(url).then((response) => {
      setData(response.data.rates)
    })
  }, [url]
  )


  const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });



  const onSubmit = (data) => {
    setFormData(data);
    setShowMessage(true);

    storeToLocal()

    // showCurrency();

    reset();
  };
  const storeToLocal = () => {
    let date = new Date().getTime();
    let dates = JSON.parse(localStorage.getItem('dates') || "[]")
    dates.unshift({ date })
    localStorage.setItem('dates', JSON.stringify(dates));
    compareTime(dates)


  }



  const compareTime = (dates) => {

    let curr = dates[0].date;
    let pre = dates[1].date
    let sec = (curr - pre) / 1000;

    localStorage.setItem('time', sec)
    let Ltime = JSON.parse(localStorage.getItem('time'));

    let min = Ltime / 60;
    let hour = min / 60;

    setTime(Ltime);

    if (Ltime <= 60) {
      setTime(sec);
      setDuration('Seconds')
    }
    else if (Ltime > 60) {
      setTime(min)
      setDuration('Minutes')
    }
    if (min > 60) {
      setTime(hour)
      setDuration('Hours')
    }


  }

  const getFormErrorMessage = (name) => {
    return errors[name] && <small className="p-error">{errors[name].message}</small>
  };
  const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;



  return (
    <div className='form'>
      <div className="form-demo">
        <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
          <div className="flex justify-content-center flex-column pt-6 px-3">
            <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
            <h5>Registration Successful!</h5>
            <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
              Your account is registered under name <b>{formData.name}</b> ; it'll be valid next 30 days without activation. Please check <b>{formData.email}</b> for activation instructions.
            </p>
          </div>
        </Dialog>
        <div className="flex justify-content-center">
          <div className="card">
            <h5 className="text-center">Register</h5>
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
              <div className="field">
                <span className="p-float-label">
                  <Controller name="name" control={control} rules={{ required: 'Name is required.' }} render={({ field, fieldState }) => (
                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                  )} />
                  <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>Name*</label>
                </span>
                {getFormErrorMessage('name')}
              </div>
              <div className="field">
                <span className="p-float-label p-input-icon-right">
                  <i className="pi pi-envelope" />
                  <Controller name="email" control={control}
                    rules={{ required: 'Email is required.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address. E.g. example@email.com' } }}
                    render={({ field, fieldState }) => (
                      <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                    )} />
                  <label htmlFor="email" className={classNames({ 'p-error': !!errors.email })}>Email*</label>
                </span>
                {getFormErrorMessage('email')}
              </div>
              <Button type="submit" label="Submit" className="mt-2" />
              <div className='time'>{`Was last clicked ${Math.round(time)} ${duration} ago`}</div>
              <BarChart data={data} />
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
export default Form;
