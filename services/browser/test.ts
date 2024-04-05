const myHeaders: Headers = new Headers();
myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

const urlencoded: URLSearchParams = new URLSearchParams();
urlencoded.append('url', 'https://www.google.com');

const requestOptions: RequestInit = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow',
};

async function makeConcurrentRequests(x: number) {
  const promises: Promise<any>[] = [];
  for (let i = 0; i < x; i++) {
    promises.push(
      fetch('http://localhost:3000/', requestOptions)
        .then((response: Response) => response.text())
        .then((result: string) => console.log(result))
        .catch((error: any) => console.log('error', error))
    );
  }
  await Promise.all(promises);
}

// Extracting the value of x from command line arguments
const args = process.argv.slice(2);
const concurrentIndex = args.indexOf('--concurrent');
const x = concurrentIndex !== -1 ? parseInt(args[concurrentIndex + 1]) : 1;

// Example: Make x concurrent requests
makeConcurrentRequests(x);
