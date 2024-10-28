import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {


    const formData = await request.formData()

    const attachmentCount = Number(formData.get('attachment-count'))
    const messageBody = formData.get("body-plain")

    const submittedBy = "member";
    const membershipNumber = "M124fwW"


    const files = await Promise.all(Array.from({ length: attachmentCount }, async (_, i) => {
        const file = formData.get(`file-${i}`) as File;

        return {
            name: file.name,
            size: file.size,
            object: Buffer.from(await file.arrayBuffer()),
            type: formData.get(`file-${i}-type`)?.toString()!,
        }
    }));

    const result = await locals.services.claims.createClaim({
        submittedBy,
        submissionChannel: 'email',
        membershipNumber,
        files
    })

    console.log(result)


    return new Response();
};


//     References: '<517AC78B.5060404@notifications.peasy.so>',
//     'body-plain': 'Hi Alice,\n' +
//         '\n' +
//         'This is Bob.\n' +
//         '\n' +
//         'I also attached a file.\n' +
//         '\n' +
//         'Thanks,\n' +
//         'Bob\n' +
//         '\n' +
//         'On 04/26/2013 11:29 AM, Alice wrote:\n' +
//         '> Hi Bob,\n' +
//         '>\n' +
//         '> This is Alice. How are you doing?\n' +
//         '>\n' +
//         '> Thanks,\n' +
//         '> Alice\n' +
//         '\n',
//     'body-html': '<html>\n' +
//         '  <head>\n' +
//         '    <meta content="text/html; charset=ISO-8859-1"\n' +
//         '      http-equiv="Content-Type">\n' +
//         '  </head>\n' +
//         '  <body text="#000000" bgcolor="#FFFFFF">\n' +
//         '    <div class="moz-cite-prefix">\n' +
//         '      <div style="color: rgb(34, 34, 34); font-family: arial,\n' +
//         '        sans-serif; font-size: 12.666666984558105px; font-style: normal;\n' +
//         '        font-variant: normal; font-weight: normal; letter-spacing:\n' +
//         '        normal; line-height: normal; orphans: auto; text-align: start;\n' +
//         '        text-indent: 0px; text-transform: none; white-space: normal;\n' +
//         '        widows: auto; word-spacing: 0px; -webkit-text-size-adjust: auto;\n' +
//         '        -webkit-text-stroke-width: 0px; background-color: rgb(255, 255,\n' +
//         '        255);">Hi Alice,</div>\n' +
//         '      <div style="color: rgb(34, 34, 34); font-family: arial,\n' +
//         '        sans-serif; font-size: 12.666666984558105px; font-style: normal;\n' +
//         '        font-variant: normal; font-weight: normal; letter-spacing:\n' +
//         '        normal; line-height: normal; orphans: auto; text-align: start;\n' +
//         '        text-indent: 0px; text-transform: none; white-space: normal;\n' +
//         '        widows: auto; word-spacing: 0px; -webkit-text-size-adjust: auto;\n' +
//         '        -webkit-text-stroke-width: 0px; background-color: rgb(255, 255,\n' +
//         '        255);"><br>\n' +
//         '      </div>\n' +
//         '      <div style="color: rgb(34, 34, 34); font-family: arial,\n' +
//         '        sans-serif; font-size: 12.666666984558105px; font-style: normal;\n' +
//         '        font-variant: normal; font-weight: normal; letter-spacing:\n' +
//         '        normal; line-height: normal; orphans: auto; text-align: start;\n' +
//         '        text-indent: 0px; text-transform: none; white-space: normal;\n' +
//         '        widows: auto; word-spacing: 0px; -webkit-text-size-adjust: auto;\n' +
//         '        -webkit-text-stroke-width: 0px; background-color: rgb(255, 255,\n' +
//         '        255);">This is Bob.<span class="Apple-converted-space">&nbsp;<img\n' +
//         '            alt="" src="cid:part1.04060802.06030207@notifications.peasy.so"\n' +
//         '            height="15" width="33"></span></div>\n' +
//         '      <div style="color: rgb(34, 34, 34); font-family: arial,\n' +
//         '        sans-serif; font-size: 12.666666984558105px; font-style: normal;\n' +
//         '        font-variant: normal; font-weight: normal; letter-spacing:\n' +
//         '        normal; line-height: normal; orphans: auto; text-align: start;\n' +
//         '        text-indent: 0px; text-transform: none; white-space: normal;\n' +
//         '        widows: auto; word-spacing: 0px; -webkit-text-size-adjust: auto;\n' +
//         '        -webkit-text-stroke-width: 0px; background-color: rgb(255, 255,\n' +
//         '        255);"><br>\n' +
//         '        I also attached a file.<br>\n' +
//         '        <br>\n' +
//         '      </div>\n' +
//         '      <div style="color: rgb(34, 34, 34); font-family: arial,\n' +
//         '        sans-serif; font-size: 12.666666984558105px; font-style: normal;\n' +
//         '        font-variant: normal; font-weight: normal; letter-spacing:\n' +
//         '        normal; line-height: normal; orphans: auto; text-align: start;\n' +
//         '        text-indent: 0px; text-transform: none; white-space: normal;\n' +
//         '        widows: auto; word-spacing: 0px; -webkit-text-size-adjust: auto;\n' +
//         '        -webkit-text-stroke-width: 0px; background-color: rgb(255, 255,\n' +
//         '        255);">Thanks,</div>\n' +
//         '      <div style="color: rgb(34, 34, 34); font-family: arial,\n' +
//         '        sans-serif; font-size: 12.666666984558105px; font-style: normal;\n' +
//         '        font-variant: normal; font-weight: normal; letter-spacing:\n' +
//         '        normal; line-height: normal; orphans: auto; text-align: start;\n' +
//         '        text-indent: 0px; text-transform: none; white-space: normal;\n' +
//         '        widows: auto; word-spacing: 0px; -webkit-text-size-adjust: auto;\n' +
//         '        -webkit-text-stroke-width: 0px; background-color: rgb(255, 255,\n' +
//         '        255);">Bob</div>\n' +
//         '      <br>\n' +
//         '      On 04/26/2013 11:29 AM, Alice wrote:<br>\n' +
//         '    </div>\n' +
//         '    <blockquote cite="mid:517AC78B.5060404@notifications.peasy.so" type="cite">Hi\n' +
//         '      Bob,\n' +
//         '      <br>\n' +
//         '      <br>\n' +
//         '      This is Alice. How are you doing?\n' +
//         '      <br>\n' +
//         '      <br>\n' +
//         '      Thanks,\n' +
//         '      <br>\n' +
//         '      Alice\n' +
//         '      <br>\n' +
//         '    </blockquote>\n' +
//         '    <br>\n' +
//         '  </body>\n' +
//         '</html>\n',
//     'In-Reply-To': '<517AC78B.5060404@notifications.peasy.so>',
//     'X-Mailgun-Variables': '{"my_var_1": "Mailgun Variable #1", "my-var-2": "awesome"}',
//     'X-Test-Upsert': "C'est très bien!",
//     recipient: 'rachel@notifications.peasy.so,emily@notifications.peasy.so',
//     Received: 'from [10.20.76.69] (Unknown [50.56.129.169]) by mxa.mailgun.org with ESMTP id 517acc75.4b341f0-worker2; Fri, 26 Apr 2013 18:50:29 -0000 (UTC)',
//     Date: 'Fri, 26 Apr 2013 11:50:29 -0700',
//     'Mime-Version': '1.0',
//     To: 'Alice <alice@notifications.peasy.so>',
//     'X-Test-Utf8': 'Доброго здоровьица!',
//     'Content-Type': 'multipart/mixed; boundary="------------020601070403020003080006"',
//     'message-headers': `[["Received","by luna.mailgun.net with SMTP mgrt 8788212249833; Fri, 26 Apr 2013 18:50:30 +0000"],["Received","from [10.20.76.69] (Unknown [50.56.129.169]) by mxa.mailgun.org with ESMTP id 517acc75.4b341f0-worker2; Fri, 26 Apr 2013 18:50:29 -0000 (UTC)"],["Message-Id","<517ACC75.5010709@notifications.peasy.so>"],["Date","Fri, 26 Apr 2013 11:50:29 -0700"],["From","Bob <bob@notifications.peasy.so>"],["User-Agent","Mozilla/5.0 (X11; Linux x86_64; rv:17.0) Gecko/20130308 Thunderbird/17.0.4"],["Mime-Version","1.0"],["To","Alice <alice@notifications.peasy.so>"],["Subject","Re: Sample POST request"],["References","<517AC78B.5060404@notifications.peasy.so>"],["In-Reply-To","<517AC78B.5060404@notifications.peasy.so>"],["X-Mailgun-Variables","{\\"my_var_1\\": \\"Mailgun Variable #1\\", \\"my-var-2\\": \\"awesome\\"}"],["X-Test-Upsert","C'est très bien!"],["X-Test-Many","v1"],["X-Test-Many","v2"],["X-Test-Many","v3"],["X-Test-Utf8","Доброго здоровьица!"],["Content-Type","multipart/mixed; boundary=\\"------------020601070403020003080006\\""],["Sender","bob@notifications.peasy.so"]]`,
//     subject: 'Re: Sample POST request',
//     from: 'Bob <bob@notifications.peasy.so>',
//     'Message-Id': '<517ACC75.5010709@notifications.peasy.so>',
//     'X-Test-Many': 'v3',
//     Sender: 'bob@notifications.peasy.so',
//     sender: 'ross@notifications.peasy.so',
//     From: 'Bob <bob@notifications.peasy.so>',
//     'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:17.0) Gecko/20130308 Thunderbird/17.0.4',
//     Subject: 'Re: Sample POST request',
//     'attachment-1': File {
//         size: 2785,
//         type: 'image/gif',
//         name: 'crabby.gif',
//         lastModified: 1730133320150
//     },
// 'attachment-2': File {
//     size: 32,
//         type: 'text/plain',
//             name: 'attached_файл.txt',
//                 lastModified: 1730133320150
// },
// 'attachment-count': '2',
//     'content-id-map': '{"<part1.04060802.06030207@notifications.peasy.so>":"attachment-1"}',
//         'stripped-text': 'Hi Alice,\n\nThis is Bob.\n\nI also attached a file.',
//             'stripped-html': '<html><head>\n' +
//                 '    <meta content="text/html; charset=ISO-8859-1" http-equiv="Content-Type">\n' +
//                 '  </head>\n' +
//                 '  <body text="#000000" bgcolor="#FFFFFF">\n' +
//                 '    <div class="moz-cite-prefix">\n' +
//                 '      <div style="color: rgb(34, 34, 34); font-family: arial,\n' +
//                 '        sans-serif; font-size: 12.666666984558105px; font-style: normal;\n' +
//                 '        font-variant: normal; font-weight: normal; letter-spacing:\n' +
//                 '        normal; line-height: normal; orphans: auto; text-align: start;\n' +
//                 '        text-indent: 0px; text-transform: none; white-space: normal;\n' +
//                 '        widows: auto; word-spacing: 0px; -webkit-text-size-adjust: auto;\n' +
//                 '        -webkit-text-stroke-width: 0px; background-color: rgb(255, 255,\n' +
//                 '        255);">Hi Alice,</div>\n' +
//                 '      <div style="color: rgb(34, 34, 34); font-family: arial,\n' +
//                 '        sans-serif; font-size: 12.666666984558105px; font-style: normal;\n' +
//                 '        font-variant: normal; font-weight: normal; letter-spacing:\n' +
//                 '        normal; line-height: normal; orphans: auto; text-align: start;\n' +
//                 '        text-indent: 0px; text-transform: none; white-space: normal;\n' +
//                 '        widows: auto; word-spacing: 0px; -webkit-text-size-adjust: auto;\n' +
//                 '        -webkit-text-stroke-width: 0px; background-color: rgb(255, 255,\n' +
//                 '        255);"><br>\n' +
//                 '      </div>\n' +
//                 '      <div style="color: rgb(34, 34, 34); font-family: arial,\n' +
//                 '        sans-serif; font-size: 12.666666984558105px; font-style: normal;\n' +
//                 '        font-variant: normal; font-weight: normal; letter-spacing:\n' +
//                 '        normal; line-height: normal; orphans: auto; text-align: start;\n' +
//                 '        text-indent: 0px; text-transform: none; white-space: normal;\n' +
//                 '        widows: auto; word-spacing: 0px; -webkit-text-size-adjust: auto;\n' +
//                 '        -webkit-text-stroke-width: 0px; background-color: rgb(255, 255,\n' +
//                 '        255);">This is Bob.<span class="Apple-converted-space">&#160;<img alt="" src="cid:part1.04060802.06030207@notifications.peasy.so" height="15" width="33"></span></div>\n' +
//                 '      <div style="color: rgb(34, 34, 34); font-family: arial,\n' +
//                 '        sans-serif; font-size: 12.666666984558105px; font-style: normal;\n' +
//                 '        font-variant: normal; font-weight: normal; letter-spacing:\n' +
//                 '        normal; line-height: normal; orphans: auto; text-align: start;\n' +
//                 '        text-indent: 0px; text-transform: none; white-space: normal;\n' +
//                 '        widows: auto; word-spacing: 0px; -webkit-text-size-adjust: auto;\n' +
//                 '        -webkit-text-stroke-width: 0px; background-color: rgb(255, 255,\n' +
//                 '        255);"><br>\n' +
//                 '        I also attached a file.<br>\n' +
//                 '        <br>\n' +
//                 '      </div>\n' +
//                 '      <div style="color: rgb(34, 34, 34); font-family: arial,\n' +
//                 '        sans-serif; font-size: 12.666666984558105px; font-style: normal;\n' +
//                 '        font-variant: normal; font-weight: normal; letter-spacing:\n' +
//                 '        normal; line-height: normal; orphans: auto; text-align: start;\n' +
//                 '        text-indent: 0px; text-transform: none; white-space: normal;\n' +
//                 '        widows: auto; word-spacing: 0px; -webkit-text-size-adjust: auto;\n' +
//                 '        -webkit-text-stroke-width: 0px; background-color: rgb(255, 255,\n' +
//                 '        255);">Thanks,</div>\n' +
//                 '      <div style="color: rgb(34, 34, 34); font-family: arial,\n' +
//                 '        sans-serif; font-size: 12.666666984558105px; font-style: normal;\n' +
//                 '        font-variant: normal; font-weight: normal; letter-spacing:\n' +
//                 '        normal; line-height: normal; orphans: auto; text-align: start;\n' +
//                 '        text-indent: 0px; text-transform: none; white-space: normal;\n' +
//                 '        widows: auto; word-spacing: 0px; -webkit-text-size-adjust: auto;\n' +
//                 '        -webkit-text-stroke-width: 0px; background-color: rgb(255, 255,\n' +
//                 '        255);">Bob</div>\n' +
//                 '      <br>\n' +
//                 '      On 04/26/2013 11:29 AM, Alice wrote:<br>\n' +
//                 '    </div>\n' +
//                 '    <br>\n' +
//                 '  \n' +
//                 '\n' +
//                 '</body></html>',
//                 'stripped-signature': 'Thanks,\nBob',
//                     token: '483377dd1e93b6c24aacc083e7312559bf823676b10439f0d7',
//                         timestamp: '1730133319',
//                             signature: '7f49d4c6ba4397333d237d3a92d63d310994e6c26e749d5724112486db9f0135'
//   }