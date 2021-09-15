import * as cdk from '@aws-cdk/core';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import * as ec2 from '@aws-cdk/aws-ec2';

export class BoardroomStackStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const subscriptionsTable = new Table(this, 'DynamoDBSubscriptionsTable', {
      tableName: 'subscriptions',
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const vpc = new ec2.Vpc(this, 'VPC');

    const defaultSecurityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      description: 'Allow ssh access to ec2 instances',
      allowAllOutbound: true,
    });
    defaultSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access from the world');

    const instance = new ec2.Instance(this, 'BotInstance', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: ec2.MachineImage.genericLinux({
        'us-east-1': 'ami-09e67e426f25ce0d7',
      }),
      securityGroup: defaultSecurityGroup,
    });

  }
}
