import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as path from 'path';
import * as fs from 'fs';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { CfnAccessKey, User } from '@aws-cdk/aws-iam';

export class BoardroomStackStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    if (! process.env.BOT_TOKEN) {
      throw new Error('Set the BOT_TOKEN env bar. `export BOT_TOKEN=....`');
    }

    const user = new User(this, 'EC2User', {
      userName: 'bot-user',
    });

    const accessKey = new CfnAccessKey(this, 'EC2UserKey', {
      userName: user.userName,
    });

    const ACCESS_KEY = accessKey.ref;
    const SECRET_ACCESS_KEY = accessKey.attrSecretAccessKey;

    /********************************** DATABASE ********************/
    const subscriptionsTable = new Table(this, 'DynamoDBSubscriptionsTable', {
      tableName: 'subscriptions',
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      // to be uncommented for production:
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    subscriptionsTable.grantReadWriteData(user);

    /********************************** EC2 ******************************/

    const vpc = new ec2.Vpc(this, 'VPC', {
      subnetConfiguration: [
        {
          name: 'ingress',
          subnetType: ec2.SubnetType.PUBLIC,
        }
      ]
    });

    const defaultSecurityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      description: 'Allow ssh access to ec2 instances',
      allowAllOutbound: true,
    });
    defaultSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access from the world');

    const instance = new ec2.Instance(this, 'BotInstance', {
      keyName: 'im-luis-key', // to be changed!
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      instanceName: 'bot-instance',
      securityGroup: defaultSecurityGroup,
      machineImage: ec2.MachineImage.genericLinux({
        'us-east-1': 'ami-09e67e426f25ce0d7',
      }),
    });

    instance.addUserData(
      `mkdir ~/.aws && echo "[default]
output=json
region = us-east-1" > ~/.aws/config && echo "[default]
aws_access_key_id = ${ACCESS_KEY}
aws_secret_access_key = ${SECRET_ACCESS_KEY}" > ~/.aws/credentials`,
      fs.readFileSync(path.join(__dirname, '../scripts/setup.sh'), 'utf-8').replace('$BOT_TOKEN', process.env.BOT_TOKEN)
    );

    subscriptionsTable.grantReadWriteData(instance);
  }
}
