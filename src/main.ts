import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ServiceAccount } from 'firebase-admin';
import { initializeFirebaseConfig } from './config/firebase-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const adminConfig: ServiceAccount = {
    projectId: 'money-tracker-ddffa',
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCUWk1vN1wI9que\n9lroGLViXv3rtX3Lk7buImI7nocO3Iz/eH4jlhY8MD8bMrbr/S+Q/PSStTqTMG9+\n8oiHQM0eoFGiKVUH7h8blshzcvIZeDxxzVQC6+AjtlXYM0PQfS9u5pirBuEeQlQH\ns9g3+dNIaziF+nZxP12UlbDpvClEyRSxWJFZHcBmGNpasNenKTfrzjHudIWWZUHM\nMOMpWEepQ/MtbesiAIIxjvA1YBcK6LnNYB/Tu67/zX2qx9sV6eXoc8xu9AwaN/kH\njFQuy9PV2Nd/lHVX8ZqoHZkGtKtc2KTzVytq4LofMdEUbYEee3oO04HNUA7aeujX\nvIN4AQBdAgMBAAECggEAETboUN065gRflk7Obiu90ngk3VbeTcLqgXgGb5Yd5GzV\nxKhB9NWr51iO3hRUsw4aWKftpl92uFEwwumYS5+KncDrMBa9OfIY9H3a7UCblLaF\nxwvVMZCW3fYAwJl0R0tbd3I1KXVfJoB6WTl2f8pSyM6+TJerakk4ze7PzFOL82H3\nn5E8NbN0JOxXvRGXTnXl8ID756g3FzBb9AWJiIOEUq9Lmte4Od8+Hm4ZS1XRLBgJ\ne8QkbihSuxfQTjcL32J5VdpEm2jJEkoQJpVnsZgNBGXHq+7y53f78zj0M51Xga8N\n1xyMg00Aiv4gofPbwfPNh3UCkUCYb27/tpn6iJa/UQKBgQDPLHxu9xssJ3FCH2mq\nSn81tOlEedXtm1gvLIUxIGY49FzZnU9kHQgYL+YYGjSQnIvi3051grMEbr0wO98C\nxdj+PXzO9DjucZ86tFgUiarj9dPHcjDsLZF0uHIg1mko/i/LI5LLHDdDrNDyRxuu\n3svrTFvhfwx5+nbuv+I7kbRNzQKBgQC3UPBw0ffhII1DvW8bHWMkgxfp23TZ9rXQ\nInGqrYXpXg5iKU814TIlkD2x9aYPDltOJ5qCBSG3Jq2bACmm7DwSEGNyIhdLcB9F\nnMPA+HZHH5MCcfhmWifiB9fbX/gN3nwpgxG9B3SXba9ghTahliw/JVn+TSF7nCCn\nK0LtO+ds0QKBgAji1JeB29WB/5aheEvIlDo+fz7jpuxhHGAxnajkxd2thYoD+FLH\n9//plgn0ncqSHGHnyBq8N2d6RH0cJE2fJNaK1p6d1Q9NKlI/SAPhf8X1VlcYq8aF\nkdaazrJf3/TVKkGhTfuOQ0SQ1gl+SU6v2blG9i3u4B8fQhitfEunzT8FAoGBALRK\n3q+XUnwQT993yHaaiI+4fyR5uotEobx6o+CBmVrULsFMb6NGQNPA8Wy9dP0J2bMc\nMFIAShCf8c6ock7BuLLre2MdNFv1gkwsyjpYI7v/yc512SCROviLTjlsQcMiNmt9\nhUyssHbeYcZEPl7eG9ZfHguGQJAaFeNUIRbB+/KBAoGBAMYiX0WgRRqo8OB6rmTN\nbLwg9bXKVx1b0aPNypyIt2yp7lCJHYZt5C9JV4tT/us0gRc9OSOpd+8ax1TGvVob\n2vY4aorhWkFvtEpNgScybQnvY3jDFElzEXxUKFAX8ZHB83Yk5VDSI4WyoSSiMt5f\nxkWbzWKkDaN/VRj5Gb/XUldi\n-----END PRIVATE KEY-----\n'.replace(
        /\\n/g,
        '\n',
      ),
    clientEmail:
      'firebase-adminsdk-z8ane@money-tracker-ddffa.iam.gserviceaccount.com',
  };
  await initializeFirebaseConfig(adminConfig);
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
