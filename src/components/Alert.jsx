export default function Alert({ type = 'error', children }) {
    const map = {
        error: 'alert alert--error',
        info: 'alert alert--info',
        success: 'alert alert--success',
        warning: 'alert alert--warning'
    }
    return <div className={map[type] || map.error}><div>{children}</div></div>
}
{/*childre e cio che va dentro alert ,che viene quindi mpstrato */}