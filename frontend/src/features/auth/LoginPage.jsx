// src/features/auth/LoginPage.jsx
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap'
import { useAuth } from '../../context/AuthContext'
import '../../styles/components/Auth.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const change = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(form.email, form.password)
      navigate(location.state?.from?.pathname || '/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="section page-offset">
      <div className="auth">
        <h1 className="heading-2">Log in</h1>
        {error && <Alert color="danger">{error}</Alert>}
        <Form onSubmit={submit}>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input id="email" name="email" type="email" required value={form.email} onChange={change} />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input id="password" name="password" type="password" required value={form.password} onChange={change} />
          </FormGroup>
          <Button color="gold" className="w-100" disabled={busy}>
            {busy ? 'Logging in...' : 'Log in'}
          </Button>
        </Form>
        <p className="auth__alt">New here? <Link to="/signup">Create an account</Link></p>
      </div>
    </section>
  )
}