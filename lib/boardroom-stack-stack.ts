import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as path from 'path';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { Asset } from '@aws-cdk/aws-s3-assets';

export class BoardroomStackStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const subscriptionsTable = new Table(this, 'DynamoDBSubscriptionsTable', {
      tableName: 'subscriptions',
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      // to be uncommented for production:
      // removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

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

    const asset = new Asset(this, 'ConfigureAsset', {
      path: path.join(__dirname, '../scripts/setup.sh'),
    });

    const localPath = instance.userData.addS3DownloadCommand({
      bucket: asset.bucket,
      bucketKey: asset.s3ObjectKey,
    });

    instance.userData.addExecuteFileCommand({
      filePath: localPath,
      arguments: '--verbose -y'
    });

    asset.grantRead(instance.role);
  }
}
