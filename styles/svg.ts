import css from 'styled-jsx/css';

export const allStyles = css.global`
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-weight: 500;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}

@media (prefers-color-scheme: dark) {
  html {
    color-scheme: light;
  }
}
.main {
  min-height: 100vh;
  padding:0;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
}
.showCase {
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem;
  max-width: 500px;
  border-radius: 1rem;
  border: 1px solid #495057;
}
.showCase hr{
  width: 100%;
  height: 1px;
  border: none;
}
.showCase h5{
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  margin: 0.6rem 0;
}
.category p{
  font-weight: 600;
}
.grid {
  display: flex;
  align-items: center;
  justify-content: left;
  flex-wrap: wrap;
  max-width: 480px;
}

.badge {
  margin: 0.5rem;
  padding: .5rem;
  text-align: center;
  color: inherit;
  text-decoration: none;
  border-radius: 10px;
  transition: color 0.15s ease, border-color 0.15s ease;
  max-width: 80px;
}

.badge p {
  margin: 0;
  font-size: 0.7rem;
  font-weight: 500;
  line-height: 1.5;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  max-width: 80px;
  white-space: nowrap;
}
.badge h6 {
  margin: 0;
  font-size: 0.6rem;
  line-height: 1.5;
  font-weight: 600;
}
`;