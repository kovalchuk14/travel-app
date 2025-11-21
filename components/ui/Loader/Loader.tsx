import css from './Loader.module.css';

export const Loader = () => {
    return (
        <div className={css.loaderContainer}>
            <div className={css.loader}></div>
        </div>
    );
};