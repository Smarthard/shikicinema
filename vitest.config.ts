import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@app-env': path.resolve(__dirname, 'src/environments'),
            '@app-e2e': path.resolve(__dirname, 'e2e'),
            '@app-electron': path.resolve(__dirname, 'electron'),
            '@app': path.resolve(__dirname, 'src/app'),
            '@app-root': path.resolve(__dirname, 'src'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['src/**/*.{spec,test}.ts'],
        coverage: {
            provider: 'istanbul',
            reporter: ['text', 'html'],
            exclude: [
                'node_modules/',
                'dist/',
                '**/*.d.ts',
                '**/*.config.ts',
                '**/*.module.ts',
            ],
        },
    },
});
