import React, { FC, memo } from 'react';

const Wrap: FC<{ onFunc: () => void }> = memo(
  (props): React.ReactElement => {
    return (
      <span onClick={props.onFunc} className="no-drag">
        <svg viewBox="0 0 1024 1024" version="1.1" p-id="44561" width="1em" height="1em">
          <path
            d="M960 414.72l-81.92-18.432c-6.144-20.48-14.848-39.936-24.576-58.88l44.544-74.24c16.384-26.624 25.088-65.536 0-90.624l-45.056-45.056c-12.288-11.776-28.16-17.92-45.056-17.408-16.896 0-34.304 5.632-47.616 14.336l-72.192 46.08c-18.944-9.728-38.4-17.92-58.368-24.576l-18.432-82.944C605.696 32.768 579.072 0 543.744 0h-64c-35.328 0-56.832 33.28-64 64l-20.48 81.92c-21.504 6.656-42.496 15.872-62.464 26.112l-73.728-47.104c-13.824-9.216-30.72-14.336-47.616-14.336-16.896-0.512-32.768 5.632-45.056 17.408l-45.056 45.056c-25.088 25.088-16.384 64 0 90.624l46.592 77.824c-8.704 17.92-16.384 35.84-22.528 54.784l-81.92 18.432C32.768 420.352 0 446.976 0 482.304v64c0 35.328 33.28 56.832 64 64l82.944 20.48c5.632 17.408 12.8 34.304 20.992 51.2l-46.592 77.824c-16.384 26.624-25.088 65.536 0 90.624l45.056 45.056c12.288 12.288 28.672 17.408 45.056 17.408 16.896 0 34.304-5.632 47.616-14.336l73.728-47.104c19.968 10.752 40.96 19.456 62.464 26.112l20.48 81.92c7.168 30.72 28.672 64 64 64h64c35.328 0 61.952-32.768 67.584-63.488l18.432-83.456c19.968-6.656 39.424-14.848 57.856-24.064l72.192 46.08c12.8 8.704 30.208 14.336 47.616 14.336 16.896 0.512 33.28-5.632 45.056-17.408l45.056-45.056c25.088-25.088 16.384-64 0-90.624l-44.544-74.24c8.704-17.408 16.896-35.84 23.04-54.784l82.944-20.48c30.72-7.168 64-28.672 64-64v-64c0.512-35.328-32.768-61.952-62.976-67.584zM512.512 666.624c-85.504 0-154.624-69.12-154.624-154.112 0-85.504 69.12-154.624 154.624-154.624s154.624 69.12 154.624 154.624c0 84.992-69.12 154.112-154.624 154.112z"
            p-id="44562"
            fill="#4A5780"
          ></path>
        </svg>
        <style jsx>{`
          span {
            padding: 0 16px;
            display: flex;
            justify-content: center;
            width: auto;
            height: 100%;
            align-items: center;
            background-color: transparent;
          }
          span:hover {
            background-color: rgba(0, 0, 0, 0.08);
          }
        `}</style>
      </span>
    );
  }
);

export default Wrap;
