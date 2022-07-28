import style from './header.module.scss'
import Link from 'next/link'

export function Header() {
  return(
    <header className={style.header}>
      <Link href="/">
        <a ><img src="/images/Logo.svg" alt="Logo" /></a>
      </Link>
    </header>
  )
}
