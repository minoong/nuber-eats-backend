import got from 'got'
import * as FormData from 'form-data'
import { Inject, Injectable } from '@nestjs/common'
import { CONFIG_OPTIONS } from 'src/common/common.constants'
import { EmailVars, MailModuleOptions } from './mail.interfaces'

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    // this.sendEmail('test1', 'test1', { key: 'key', value: 'value' })
  }

  private async sendEmail(
    subject: string,
    content: string,
    emailVars: EmailVars[],
  ) {
    const form = new FormData()
    form.append('from', `LMW from Nuber Eats <mailgun@${this.options.domain}>`)
    form.append('to', `alsdndjdrktl@naver.com`)
    form.append('subject', subject)

    const text = emailVars.map((data) => {
      return `${data.key}, ${data.value}`
    })

    form.append('text', text.join())

    try {
      const res = await got(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      )
    } catch (error) {
      console.log(error)
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Verify Your Email', 'test', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ])
  }
}
