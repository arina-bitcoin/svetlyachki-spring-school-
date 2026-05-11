import { NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <>
      <header style={{ background: '#2d3e40', padding: '1rem', display: 'flex', gap: '2rem', justifyContent: 'center' }}>
        <NavLink to="/viz" style={({ isActive }) => ({ color: isActive ? '#f1c40f' : 'white', textDecoration: 'none', fontWeight: 'bold' })}>
          Визуализация
        </NavLink>
        <NavLink to="/search" style={({ isActive }) => ({ color: isActive ? '#f1c40f' : 'white', textDecoration: 'none', fontWeight: 'bold' })}>
          Поиск расписания сотрудника
        </NavLink>
        <NavLink to="/charts" style={({ isActive }) => ({ color: isActive ? '#f1c40f' : 'white', textDecoration: 'none', fontWeight: 'bold' })}>
          Графики
        </NavLink>
      </header>
      <main style={{ flex: 1, padding: '1rem' }}>
        <Outlet />
      </main>
    </>
  )
}