# Boardroom CDK to deploy bot(s)

This CDK instance deploys the bot in an EC2 instance. This is a summary of what it does:

1. Create a user and access keys for that user
2. Create a DynamoDB table called `subscriptions`.
3. Grant the user permissions to access the subscriptions table
4. Create an EC2 instance (t2.micro), with the port 22 open using the key `bot-ssh-key`
5. Pass the keys for the user to .aws/credentials
6. Run the set up files, which installs dependencies and the bot, and runs it permanently.

## Set up

The AWS CLI and AWS CDK must be installed. You can refer to [this guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) to install and configure the CLI and [this guide](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_install) to install the CDK.

The Discord application token must be exported as `BOT_TOKEN`: `export BOT_TOKEN=b32...`.
You can generate an application token from the [Discord developer portal](https://discord.com/developers/applications).

You also need an SSH key to access the server called `bot-ssh-key`. This is so you can access the server later on. See a guide [here](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#having-ec2-create-your-key-pair)

Once you have the cdk installed, the token exported and the key created, you can run `cdk deploy`.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
