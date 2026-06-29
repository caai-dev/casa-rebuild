import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

try {
  console.log('Building Quick Links Portal project...');
  execSync('npm --prefix quick-links run build', { stdio: 'inherit' });

  // Create a .nojekyll file to prevent GitHub pages from ignoring assets
  writeFileSync(join('quick-links', 'dist', '.nojekyll'), '');

  console.log('Initializing temporary git repository in quick-links/dist...');
  const options = { cwd: join('quick-links', 'dist'), stdio: 'inherit' };
  execSync('git init', options);
  execSync('git add -A', options);
  execSync('git commit -m "Deploy quick-links production build"', options);
  execSync('git branch -M master', options);

  console.log('Force pushing build to deploy-links branch...');
  // Force push to the deploy-links branch of the remote repo
  execSync('git push -f https://github.com/caai-dev/casa-rebuild.git master:deploy-links', options);
  console.log('Successfully deployed to branch: deploy-links');
} catch (error) {
  console.error('Deployment failed:', error);
  process.exit(1);
}
