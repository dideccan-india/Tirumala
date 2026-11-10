// src/features/auth/SignupPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap'
import { useAuth } from '../../context/AuthContext'
import '../../styles/components/Auth.css'

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const change = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    if (form.password !== form.confirm) return setError('Passwords do not match')
    setBusy(true)
    try {
      const { confirm, ...data } = form // don't send confirm to the server
      await signup(data)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="section page-offset">
      <div className="auth">
        <h1 className="heading-2">Create account</h1>
        {error && <Alert color="danger">{error}</Alert>}
        <Form onSubmit={submit}>
          <FormGroup>
            <Label for="name">Full name</Label>
            <Input id="name" name="name" required value={form.name} onChange={change} />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input id="email" name="email" type="email" required value={form.email} onChange={change} />
          </FormGroup>
          <FormGroup>
            <Label for="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" required value={form.phone} onChange={change} />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input id="password" name="password" type="password" required value={form.password} onChange={change} />
          </FormGroup>
          <FormGroup>
            <Label for="confirm">Confirm password</Label>
            <Input id="confirm" name="confirm" type="password" required value={form.confirm} onChange={change} />
          </FormGroup>
          <Button color="gold" className="w-100" disabled={busy}>
            {busy ? 'Creating...' : 'Sign up'}
          </Button>
        </Form>
        <p className="auth__alt">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </section>
  )
}