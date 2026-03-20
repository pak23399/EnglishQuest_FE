import { Container } from '@/components/common/container';

export function Footer() {
  return (
    <footer className="footer">
      <Container>
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-3 py-5"></div>
      </Container>
    </footer>
  );
}
