import style from './header.module.scss'
import Link from 'next/link'

export default function Header() {
  return(
    <header className={style.header}>
      <Link href="/">
        <a>
          <img src="/images/Logo.svg" alt="logo" />
        </a>
      </Link>
    </header>
  )
}
