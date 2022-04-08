import { h, Component } from 'preact' // eslint-disable-line no-unused-vars

export const ProgressHeader = (props) => {
  if (props.stage === 3) {
    return (
      <ul class='main-progress'>
        <li class='progress-done'><i class='fa fa-check-circle' />Upload<span class='big-screen'> your spreadsheet</span></li>
        <li class='progress-current'>Match<span class='big-screen'> columns</span></li>
        <li class='progress-incomplete'>Repair<span class='big-screen'> problems</span></li>
        <li class='progress-incomplete'>Complete</li>
      </ul>)
  } else if (props.stage === 4) {
    return (
      <ul class='main-progress'>
        <li class='progress-done'><i class='fa fa-check-circle' />Upload<span class='big-screen'> your spreadsheet</span></li>
        <li class='progress-done'><i class='fa fa-check-circle' />Match<span class='big-screen'> columns</span></li>
        <li class='progress-current'>Repair<span class='big-screen'> problems</span></li>
        <li class='progress-incomplete'>Complete</li>
      </ul>)
  }
}

export const GenericButton = (props) =>
  <span>
    <button class={'button ' + props.classes.join(' ')} tabIndex={props.tabIndex || 0} id={props.id} onClick={props.onClick}>{props.title}</button>
  </span>

export const Logo = (props) =>
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <path fill={props.fill || '#000'} fill-rule='nonzero' d='M49.9 0L0 22.62v.2l49.9 22.63 50.1-22.7v-.05L49.9 0zm.1 37.37L18.18 22.73 50 8.08l31.82 14.65L50 37.37zM0 68.77v8.4L49.9 100 100 77.1v-8.4L49.9 91.52 0 68.76zM0 42.5v8.42l49.9 22.82 50.1-22.9v-8.42L49.9 65.27 0 42.5z' />
  </svg>

export const FooterBrand = () =>
  <a class='footer-brand' href={'https://flatfile.io/?utm_source=user_app&utm_medium=footer&utm_name=' + window.FF_LICENSE_KEY} target='_blank'>
    <Logo />
    <span>Flatfile</span>
  </a>

export const CloseButton = (props) =>
  <button class='flatfile-close-button' onClick={props.onClick}>
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <path fill='#000' fill-rule='nonzero' d='M94.3 0c-1.5 0-3 .6-4 1.7L50 42 9.8 1.6c-2.3-2.3-6-2.3-8 0-2.4 2.2-2.4 5.8 0 8l40 40.3L2 90.2c-2.4 2.3-2.4 6 0 8 1 1.2 2.5 1.8 4 1.8 1.4 0 3-.6 4-1.7L50 58l40.2 40.3c1 1 2.6 1.7 4 1.7 1.5 0 3-.6 4-1.7 2.4-2.2 2.4-5.8 0-8L58.3 50 98 9.8c2.4-2.3 2.4-6 0-8-1-1.2-2.5-1.8-4-1.8z' />
    </svg>
  </button>
