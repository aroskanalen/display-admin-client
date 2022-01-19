import FormInput from "../util/forms/form-input";
import { Button, Card, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { api } from "../../redux/api/api.generated";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router'

function Login() {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const onChange = ({target}) => {
    if (target?.id === 'email') {
      setEmail(target.value);
    } else if (target?.id === 'password') {
      setPassword(target.value);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    dispatch(
      api.endpoints.postCredentialsItem.initiate({
        credentials: JSON.stringify({
          email: email,
          password: password,
        }),
      })
    ).then((response) => {
      if (response?.data?.token) {
        localStorage.setItem("api-token", response.data.token);
        history.push('/');
      }
    }).catch((err) => {
      setError(JSON.stringify(err));
    });
  }

  return (
    <Card className="m-3">
      <h3 className="m-3">{t('login.please-authenticate')}</h3>
      <Form onSubmit={onSubmit} className="m-3">
        <FormInput onChange={onChange} value={email} name="email" label={t('login.email')} required />
        <FormInput onChange={onChange} value={password} name="password" label={t('login.password')} type="password" required />
        <Button type="submit" className="mt-3">{t('login.submit')}</Button>
        {error &&
          <div>Fejl: {error}</div>
        }
      </Form>
    </Card>
  );
}

export default Login;
