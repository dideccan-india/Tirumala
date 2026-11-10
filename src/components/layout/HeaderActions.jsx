// src/components/layout/HeaderActions.jsx
import { Link, useNavigate } from 'react-router-dom'
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { FiUser } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

export default function HeaderActions({ onNavigate }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <UncontrolledDropdown>
      <DropdownToggle tag="button" className="profile-toggle" aria-label="Account">
        <FiUser size={22} />
      </DropdownToggle>
      <DropdownMenu end>
        {user ? (
          <>
            <DropdownItem header>Hi, {user.name}</DropdownItem>
            <DropdownItem tag={Link} to="/profile" onClick={onNavigate}>My profile</DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={() => { logout(); onNavigate?.(); navigate('/') }}>Log out</DropdownItem>
          </>
        ) : (
          <>
            <DropdownItem tag={Link} to="/login" onClick={onNavigate}>Log in</DropdownItem>
            <DropdownItem tag={Link} to="/signup" onClick={onNavigate}>Sign up</DropdownItem>
          </>
        )}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}