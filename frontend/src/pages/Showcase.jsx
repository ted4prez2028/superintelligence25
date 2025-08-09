import React from 'react';
import Shell from '../ui/Shell';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Badge from '../components/Badge';

export default function Showcase(){
  return (<Shell title="UI Showcase">
    <div className="space-y-6">
      <Card title="Buttons"><div className="flex flex-wrap gap-3"><Button>Default</Button><Button variant="primary">Primary</Button><Button variant="ghost">Ghost</Button></div></Card>
      <Card title="Inputs"><div className="grid sm:grid-cols-2 gap-3"><Input placeholder="Your name" /><Input placeholder="Email address" /><Textarea placeholder="Message..." className="sm:col-span-2" /></div></Card>
      <Card title="Badges"><div className="flex gap-3"><Badge>Alpha</Badge><Badge className="bg-success/20 border-success/30 text-success">Success</Badge><Badge className="bg-warn/20 border-warn/30 text-warn">Warning</Badge><Badge className="bg-danger/20 border-danger/30 text-danger">Danger</Badge></div></Card>
    </div>
  </Shell>);
}
