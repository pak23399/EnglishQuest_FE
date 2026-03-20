import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';

export function Error404() {
  return (
    <>
      <div className="mb-10">
        <img
          src={toAbsoluteUrl('/media/illustrations/errors/error-404.svg')}
          className="max-h-[160px]"
          alt="image"
        />
      </div>

      <span className="badge badge-primary badge-outline mb-3">Lỗi 404</span>

      <h3 className="text-2xl font-semibold text-mono text-center mb-2">
        Không tìm thấy trang
      </h3>

      <div className="text-base text-center text-secondary-foreground mb-10">
        Trang yêu cầu không tồn tại. Kiểm tra lại đường dẫn hoặc&nbsp;
        <Link
          to="/"
          className="text-primary font-medium hover:text-primary-active"
        >
          Trở về trang chủ
        </Link>
        .
      </div>
    </>
  );
}
