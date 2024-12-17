import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { cn } from '~/lib/utils';
import { Switch } from '~/components/ui/switch';
import { useToast } from '~/components/ui/toast';

const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
];

const formSchema = Yup.object().shape({
  email: Yup.string().email('Please enter a valid email address.').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters.')
    .required('Password is required'),
  about: Yup.string().required('We need to know.'),
  accountType: Yup.string().oneOf(['staff', 'admin', 'owner']).required(),
  framework: Yup.object().shape({
    value: Yup.string().required(),
    label: Yup.string().required(),
  }),

  enableNotifications: Yup.boolean(),
  dob: Yup.string().required('Please enter your date of birth'),
  tos: Yup.boolean().oneOf([true], 'You must accept the terms & conditions'),
});

export default function FormScreen() {
  const scrollRef = React.useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const [selectTriggerWidth, setSelectTriggerWidth] = React.useState(0);
  const { toast } = useToast();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      about: '',
      accountType: 'staff',
      framework: { value: '', label: '' },
      enableNotifications: false,
      dob: '',
      tos: false,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      console.log('Form submitted:', values);

      toast({
        title: 'Form Submitted!',
        description: 'Your form has been successfully submitted.',
      });

      Alert.alert('Form Submitted!', JSON.stringify(values, null, 2), [
        {
          text: 'OK',
          onPress: () => {
            scrollRef.current?.scrollTo({ y: 0 });
            formik.resetForm();
          },
        },
      ]);
    },
  });

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <ScrollView
      ref={scrollRef}
      contentContainerClassName="p-6 mx-auto w-full max-w-xl"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-7">
        <View>
          <Label>Email</Label>
          <Input
            placeholder="hello@zachnugent.ca"
            autoCapitalize="none"
            autoComplete="email"
            onChangeText={formik.handleChange('email')}
            onBlur={formik.handleBlur('email')}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <Text className="text-red-500">{formik.errors.email}</Text>
          )}
        </View>

        <View>
          <Label>Password</Label>
          <Input
            placeholder="********"
            secureTextEntry
            autoComplete="password"
            onChangeText={formik.handleChange('password')}
            onBlur={formik.handleBlur('password')}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <Text className="text-red-500">{formik.errors.password}</Text>
          )}
        </View>

        <View>
          <Label>About</Label>
          <Input
            placeholder="I am ..."
            onChangeText={formik.handleChange('about')}
            onBlur={formik.handleBlur('about')}
            value={formik.values.about}
          />
          {formik.touched.about && formik.errors.about && (
            <Text className="text-red-500">{formik.errors.about}</Text>
          )}
        </View>

        <View>
          <Label>Account Type</Label>
          <RadioGroup
            value={formik.values.accountType}
            onValueChange={(value) => formik.setFieldValue('accountType', value)}
          >
            <View className="flex-row gap-4">
              {['staff', 'admin', 'owner'].map((value) => (
                <View key={value} className="flex-row gap-2 items-center">
                  <RadioGroupItem value={value} />
                  <Label
                    className="capitalize"
                    onPress={() => formik.setFieldValue('accountType', value)}
                  >
                    {value}
                  </Label>
                </View>
              ))}
            </View>
          </RadioGroup>
          {formik.touched.accountType && formik.errors.accountType && (
            <Text className="text-red-500">{formik.errors.accountType}</Text>
          )}
        </View>

        <View>
          <Label>Favorite Framework</Label>
          <Select
            value={formik.values.framework}
            defaultValue={formik.values.framework}
            onValueChange={(option) => {
              formik.setFieldValue('framework', option);
            }}
          >
            <SelectTrigger
              onLayout={(ev) => {
                setSelectTriggerWidth(ev.nativeEvent.layout.width);
              }}
            >
              <SelectValue
                className={cn(
                  'text-sm native:text-lg',
                  formik.values.framework.value ? 'text-foreground' : 'text-muted-foreground'
                )}
                placeholder="Select a framework"
              />
            </SelectTrigger>
            <SelectContent insets={contentInsets} style={{ width: selectTriggerWidth }}>
              <SelectGroup>
                {frameworks.map((framework) => (
                  <SelectItem key={framework.value} label={framework.label} value={framework.value}>
                    <Text>{framework.label}</Text>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {formik.touched.framework && formik.errors.framework && (
            <Text className="text-red-500">{formik.errors.framework.value}</Text>
          )}
        </View>

        <View className="flex-row items-center justify-between">
          <Label>Enable Notifications</Label>
          <Switch
            checked={formik.values.enableNotifications}
            onCheckedChange={(checked) => {
              formik.setFieldValue('enableNotifications', checked);
            }}
          />
        </View>

        <View className="flex-row items-center justify-between">
          <Label>Accept Terms & Conditions</Label>
          <Switch
            checked={formik.values.tos}
            onCheckedChange={(checked) => {
              formik.setFieldValue('tos', checked);
            }}
          />
        </View>
        {formik.touched.tos && formik.errors.tos && (
          <Text className="text-red-500">{formik.errors.tos}</Text>
        )}

        <View>
          <Label>Date of Birth</Label>
          <Input
            placeholder="YYYY-MM-DD"
            onChangeText={formik.handleChange('dob')}
            onBlur={formik.handleBlur('dob')}
            value={formik.values.dob}
          />
          {formik.touched.dob && formik.errors.dob && (
            <Text className="text-red-500">{formik.errors.dob}</Text>
          )}
        </View>

        <Button
          onPress={() => {
            formik.handleSubmit();
            // Log any validation errors
            if (Object.keys(formik.errors).length > 0) {
              console.log('Validation errors:', formik.errors);
              toast({
                title: 'Validation Error',
                description: 'Please check all fields and try again.',
                variant: 'destructive',
              });
            }
          }}
          disabled={formik.isSubmitting}
        >
          <Text>{formik.isSubmitting ? 'Submitting...' : 'Submit'}</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
