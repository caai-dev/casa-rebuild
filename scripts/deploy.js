import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

try {
  console.log('Building project...');
  execSync('npm run build', { stdio: 'inherit' });

  // Create a .nojekyll file to prevent GitHub pages from ignoring assets (if deployed there)
  writeFileSync(join('dist', '.nojekyll'), '');

  console.log('Initializing temporary git repository in dist...');
  const options = { cwd: 'dist', stdio: 'inherit' };
  execSync('git init', options);
  execSync('git add -A', options);
  execSync('git commit -m "Deploy production build"', options);
  execSync('git branch -M master', options);

  console.log('Force pushing build to deploy branch...');
  // Force push to the deploy branch of the remote repo
  execSync('git push -f https://github.com/caai-dev/casa-rebuild.git master:deploy', options);
  console.log('Successfully deployed to branch: deploy');
} catch (error) {
  console.error('Deployment failed:', error);
  process.exit(1);
}
