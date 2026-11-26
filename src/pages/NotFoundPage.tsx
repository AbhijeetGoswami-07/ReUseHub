import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Sprout, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-20 md:py-32 flex items-center justify-center">
      <Container size="sm">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-forest-100 text-forest mx-auto flex items-center justify-center">
            <Sprout className="w-8 h-8 text-forest-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-extrabold text-forest">
              404
            </h1>
            <h2 className="text-xl font-bold text-forest-800">
              Page Not Found
            </h2>
            <p className="text-sm text-dark-muted max-w-sm mx-auto">
              This page may have been recycled or moved to a different address.
            </p>
          </div>
          <div>
            <Link to="/">
              <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Return to ReUseHub Home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};
